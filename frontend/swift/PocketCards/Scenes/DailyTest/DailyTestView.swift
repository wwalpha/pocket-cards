//
//  DailyTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//
import SwiftUI

struct DailyTestView: View {
    var interactor: DailyTestBusinessLogic?
    private var subject: String

    @ObservedObject var viewModel: DailyTestViewModel

    init(subject: String) {
        self.subject = subject
        viewModel = DailyTestViewModel()
    }

    var body: some View {
        if viewModel.title.isEmpty {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestion()
                }
        } else if viewModel.title == "Nothing" {
            Text("今日のテストは終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            // Language
            if subject == SUBJECT.LANGUAGE {
                ChoiceQuestion(
                    question: viewModel.title,
                    choices: viewModel.choices,
                    isShowError: "",
                    onChoice: interactor!.onChoice
                )
            } else {
                // Society or Science
                FlashCard(
                    question: viewModel.title,
                    answer: viewModel.answer,
                    action: interactor!.onAction,
                    onPlay: interactor!.onPlay
                )
            }
        }
    }
}

extension DailyTestView: DailyTestDisplayLogic {
    func showNext(title: String, answer: String, choices: [String]?) {
        viewModel.title = title
        viewModel.answer = answer
        viewModel.choices = choices != nil ? choices! : []
    }

    func showNothing() {
        viewModel.title = "Nothing"
    }
}

extension DailyTestView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyTestInteractor(subject: subject)
        let presenter = DailyTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct DailyTestView_Previews: PreviewProvider {
    static var previews: some View {
        DailyTestView(subject: SUBJECT.LANGUAGE)
    }
}
