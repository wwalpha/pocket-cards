//
//  WeeklyPracticeView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import SwiftUI

struct WeeklyPracticeView: View {
    var interactor: WeeklyPracticeBusinessLogic?

    @ObservedObject var viewModel = WeeklyPracticeViewModel()

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestions()
                }
        } else if viewModel.isFinish {
            Text("学習は終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            if viewModel.question?.choices != nil {
                ChoiceQuestion(
                    question: viewModel.question!,
                    isShowError: viewModel.isShowError,
                    onChoice: interactor!.onChoice
                )
            } else {
                // Society or Science
                FlashCard(question: viewModel.question!, action: interactor!.onAction)
            }
        }
    }
}

extension WeeklyPracticeView: WeeklyPracticeDisplayLogic {
    func showError(index: String) {
        DispatchQueue.main.async {
            viewModel.isShowError = index
        }
    }

    func showNext(model: WeeklyPracticeViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
        }

        viewModel.question = model.question
    }
}

extension WeeklyPracticeView {
    func configureView(groupId: String) -> some View {
        var view = self
        let interactor = WeeklyPracticeInteractor(groupId: groupId)
        let presenter = WeeklyPracticePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.isLoading = true

        interactor.loadQuestions()

        return view
    }
}

struct WeeklyPracticeView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyPracticeView()
    }
}
